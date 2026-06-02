/**
 * Wrapper hook for TanStack Query with generated SDK
 *
 * This hook abstracts the generated API client and provides a consistent
 * interface for making API calls with automatic caching and refetching.
 */

import {
  UseQueryOptions,
  UseQueryResult,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useMutation,
} from '@tanstack/react-query';
import { queryClient } from './queryClient';

type QueryFnType = (...args: any[]) => Promise<any>;

/**
 * Hook for fetching data from the API
 *
 * @example
 * const { data, isLoading, error } = useApiQuery(
 *   ['users'],
 *   () => UserService.getUsers()
 * );
 */
export function useApiQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends string[] = string[],
>(
  queryKey: TQueryKey,
  queryFn: QueryFnType,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<TData, TError> {
  return useQuery({
    queryKey,
    queryFn,
    ...options,
  });
}

/**
 * Hook for mutating data via the API
 *
 * @example
 * const { mutate, isPending } = useApiMutation(
 *   (data) => UserService.createUser(data),
 *   {
 *     onSuccess: () => {
 *       queryClient.invalidateQueries({ queryKey: ['users'] });
 *     }
 *   }
 * );
 */
export function useApiMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    'mutationFn'
  >,
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useMutation({
    mutationFn,
    ...options,
  });
}

export { queryClient };
