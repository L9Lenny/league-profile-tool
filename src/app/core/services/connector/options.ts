export interface Options {
  rejectUnauthorized: boolean,
  headers: {
    "Accept": string,
    "Content-Type"?: string,
    "Authorization": string
  },
  url: string,
  method?: string,
  json?: boolean,
  body?: any
}
