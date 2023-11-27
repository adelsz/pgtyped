/** Types generated for queries found in "src/audio_books/audio_books.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetAudioBooks' parameters type */
export type IGetAudioBooksParams = void;

/** 'GetAudioBooks' return type */
export interface IGetAudioBooksResult {
  duration: string;
  id: number;
  text_book_id: number | null;
}

/** 'GetAudioBooks' query type */
export interface IGetAudioBooksQuery {
  params: IGetAudioBooksParams;
  result: IGetAudioBooksResult;
}

const getAudioBooksIR: any = {"usedParamSet":{},"params":[],"statement":"select * from audio_books"};

/**
 * Query generated from SQL:
 * ```
 * select * from audio_books
 * ```
 */
export const getAudioBooks = new PreparedQuery<IGetAudioBooksParams,IGetAudioBooksResult>(getAudioBooksIR);


