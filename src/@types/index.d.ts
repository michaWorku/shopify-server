import { Request } from 'express';
import * as core from 'express-serve-static-core';

interface RequestCustom extends Request {
  user?: any;
}

interface Query extends core.Query {}

interface ReqBody extends ReqBody {}
