import type { ErrorLogDto } from './dto';

export interface ErrorTrack {
  (
    error: Error,
    options: Partial<ErrorLogDto>,
  ): Promise<void>;
}
