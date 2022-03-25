export enum UserRoles {
    ADMIN = 'admin',
    USER = 'user'
  }
  
export const filterObj = (obj: any, ...fields: string[]) => {
const newObj: any = {};
fields.forEach((field) => (newObj[field] = obj[field]));
return newObj;
};
