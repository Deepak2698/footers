declare module '@tanstack/react-query' {
  // Minimal declarations to satisfy TypeScript in this workspace.
  // For full typings, ensure @tanstack/react-query is installed in node_modules.
  export const QueryClient: any;
  export const QueryClientProvider: any;
  export function useQuery(options: any): any;
  export function useMutation(options: any): any;
}
