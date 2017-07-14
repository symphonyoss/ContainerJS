const isUrlPattern = /^https?:\/\//i;

export class Uri {
  static getAbsoluteUrl(url: string): string {
    if (url && !isUrlPattern.test(url)) {
      const path = url.startsWith('/')
          ? location.origin
          : location.href.substring(0, location.href.lastIndexOf('/') + 1);

      return `${path}${url}`;
    }
    return url;
  }
}
