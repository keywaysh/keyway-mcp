/**
 * keyway_get_secret tool
 * Retrieves a single secret value by name
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getToken } from '../utils/auth.js';
import { getRepository } from '../utils/git.js';
import { getSecretValue, APIError } from '../utils/api.js';

export async function getSecret(args: {
  name: string;
  environment?: string;
}): Promise<CallToolResult> {
  const token = await getToken();
  const repository = getRepository();
  const environment = args.environment || 'development';

  try {
    const result = await getSecretValue(repository, environment, args.name, token);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ name: result.key, value: result.value, environment: result.environment }, null, 2),
        },
      ],
    };
  } catch (error) {
    if (error instanceof APIError && error.statusCode === 404) {
      return {
        content: [
          {
            type: 'text',
            text: error.message,
          },
        ],
        isError: true,
      };
    }
    throw error;
  }
}
