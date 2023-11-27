export class DurationParser {
  static parseDuration(duration: string): number {
    const regex = /(\d+)\s*(s|second|seconds|m|minute|minutes|h|hour|hours|d|day|days)/i;
    const match = duration.match(regex);

    if (!match) {
      throw new Error(`Invalid duration format: ${duration}`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 's':
      case 'second':
      case 'seconds':
        return value * 1000;
      case 'm':
      case 'minute':
      case 'minutes':
        return value * 60 * 1000;
      case 'h':
      case 'hour':
      case 'hours':
        return value * 60 * 60 * 1000;
      case 'd':
      case 'day':
      case 'days':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error(`Unsupported time unit: ${unit}`);
    }
  }
}
