/**
 * Copyright (c) 2020, Amdocs Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as number from 'utility/number';

export const map = (...args) => v => number.map(v, ...args);
export const clamp = (...args) => v => number.clamp(v, ...args);
export const interval = (...args) => v => number.interval(v, ...args);
export const decimals = (...args) => v => number.decimals(v, ...args);

/**
 * This transformer calculates the angle between the line created by the mouse position
 * and the given center point, and the horizontal x axis. This angle is than mapped from
 * the range given in 'angle', to the range given in 'output'.
 *
 * @param x The center's x coordinate
 * @param y The center's y coordinate
 * @param from The start angle, relative to the positive y axis (in degrees)
 * @param range The angle range (max degrees from the start angle)
 * @param min The output range minimum
 * @param max The output range maximum
 * @returns {function({left: *, top: *}): number}
 */
export const angle = ({center: {x, y}, angle: {from, range}, output: {min, max}}) => ({left, top}) => {
    const adjacent = left - x;
    const opposite = top - y;
    const radians = Math.atan(opposite / adjacent) + (adjacent < 0 ? Math.PI : 0) + Math.PI / 2;
    let angle = radians * (180 / Math.PI); // Convert angle to degrees

    // If from + range is more than 360, and the current angle is passed 360,
    // we add 360 to it since otherwise it will start from zero again.
    // The last part is used for when the angle is outside of the given range.
    // In that case, we want the angle to go either to the start of the range, or to the end
    // of the range, based on proximity to either end.
    if (range + from > 360 && angle >= 0 && angle < range / 2 - 180 + from) {
        angle += 360;
    }

    return map(from, range + from, min, max)(number.clamp(angle, from, range + from));
};