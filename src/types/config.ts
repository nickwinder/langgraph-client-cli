import { z } from 'zod';

export const ConfigSchema = z.object({
  url: z.string().url().optional(),
  apiKey: z.string().optional(),
  defaultAssistant: z.string().optional(),
  timeout: z.number().positive().optional(),
  retries: z.number().min(0).optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export const RunConfigSchema = z.object({
  input: z.record(z.unknown()).nullable().optional(),
  config: z.record(z.unknown()).nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
  multitaskStrategy: z.enum(['reject', 'interrupt', 'rollback']).nullable().optional(),
  streamMode: z.enum(['values', 'updates', 'debug', 'messages']).nullable().optional(),
});

export type RunConfig = z.infer<typeof RunConfigSchema>;

export const ThreadConfigSchema = z.object({
  metadata: z.record(z.unknown()).nullable().optional(),
  ifExists: z.enum(['raise', 'do_nothing']).nullable().optional(),
});

export type ThreadConfig = z.infer<typeof ThreadConfigSchema>;

export const AssistantConfigSchema = z.object({
  graphId: z.string(),
  metadata: z.record(z.unknown()).nullable().optional(),
  config: z.record(z.unknown()).nullable().optional(),
  assistantId: z.string().nullable().optional(),
  ifExists: z.enum(['raise', 'do_nothing']).nullable().optional(),
  name: z.string().nullable().optional(),
});

export type AssistantConfig = z.infer<typeof AssistantConfigSchema>;