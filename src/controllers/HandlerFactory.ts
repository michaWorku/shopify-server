import {  Response, NextFunction } from 'express';
import {catchAsync } from '../helpers/catchAsync'
import AppError from '../helpers/appError'
import { RequestCustom} from '../@types'
import { Model } from 'mongoose';
import { APIFeatures } from '../helpers/APIFeatures';


export const deleteOne = (Model: Model<any>) =>
  catchAsync(async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const document = await Model.findByIdAndDelete(req.params.id);

    if (!document) throw new AppError(`ID (${req.params.id}) not found!`, 404);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = (Model: Model<any>) =>
  catchAsync(async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) throw new AppError(`ID (${req.params.id}) not found!`, 404);

    const modelName = Model.collection.collectionName;
    const data = { [`${modelName}`]: document };

    res.status(200).json({
      status: 'success',
      data: { data },
    });
  });

export const createOne = (Model: Model<any>) =>
  catchAsync(async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const document = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: document,
    });
  });

export const getAll = (
  Model: Model<any>,
  filters?: [objKey: string, value: string][],
  populate?: string[]
) => getOneOrMore(Model, filters, populate);

export const getOne = (
  Model: Model<any>,
  filters?: [objKey: string, value: string][],
  populate?: string[]
) => getOneOrMore(Model, filters, populate);

const getOneOrMore = (
  Model: Model<any>,
  filters?: [objKey: string, value: string][],
  populate?: string[]
) =>
  catchAsync(async (req: RequestCustom, res: Response, _next: NextFunction) => {
    const filter =
      filters?.reduce((prev, cur) => {
        //@ts-ignore
        prev[cur[0]] = req.params[cur[1]];
        return prev;
      }, {}) ?? {};

    const features = new APIFeatures(
        //@ts-ignore
      Model.find(filter).populate(populate),
      req.query
    )
      .filter()
      .sort()
      .paginate()
      .limitFields();

    const doc = await features.query;
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: { doc },
    });
  });