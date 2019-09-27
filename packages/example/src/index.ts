import { SELECT_ALL_USERS, SELECT_USER_IDS } from "./users/queries";
import { ISelectAllUsersParams, ISelectAllUsersResult } from "./users/queries.types";

const query = async <TParams, TResult>(
  queryBody: string,
  params: TParams,
): Promise<TResult> => (null as any);

async function main() {
  const users = await query<ISelectAllUsersParams, ISelectAllUsersResult>(
    SELECT_ALL_USERS,
    {
      ages: [34, 45],
    },
  );
}

main();
