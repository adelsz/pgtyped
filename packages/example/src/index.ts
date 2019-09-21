import { ISelectAllUsersParams, ISelectAllUsersResult } from './users/queries.types';
import { SELECT_ALL_USERS, SELECT_USER_IDS } from './users/queries';

const query = async <TParams, TResult>(
  query: string,
  params: TParams,
): Promise<TResult> => (null as any);

const result = query<ISelectAllUsersParams, ISelectAllUsersResult>(
  SELECT_ALL_USERS,
  undefined,
);
