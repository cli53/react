/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import MAX_SIGNED_31_BIT_INT from './maxSigned31BitInt';

// TODO: Use an opaque type once ESLint et al support the syntax
export type ExpirationTime = number;

export const NoWork = 0;
export const Sync = 1;
export const Never = MAX_SIGNED_31_BIT_INT;

const UNIT_SIZE = 10;
const MAGIC_NUMBER_OFFSET = 2;

// 1 unit of expiration time represents 10ms.
export function msToExpirationTime(ms: number): ExpirationTime {
  // Always add an offset so that we don't clash with the magic number for NoWork.
  return ((ms / UNIT_SIZE) | 0) + MAGIC_NUMBER_OFFSET;
}

export function expirationTimeToMs(expirationTime: ExpirationTime): number {
  return (expirationTime - MAGIC_NUMBER_OFFSET) * UNIT_SIZE;
}

function ceiling(num: number, precision: number): number {
  return (((num / precision) | 0) + 1) * precision;
}

export function computeExpirationBucket(
  currentTime: ExpirationTime,
  expirationInMs: number,
  bucketSizeMs: number,
): ExpirationTime {
  return ceiling(
    currentTime + expirationInMs / UNIT_SIZE,
    bucketSizeMs / UNIT_SIZE,
  );
}
