export interface Request {
  url: string;
  method: string;
  params: any; // TODO type
  callback: (status: number, responseText: string) => void;
}

export class QueuedRequester {
  private queue: Request[];
  private running: boolean;
  private xmlhttp: XMLHttpRequest | null;

  constructor() {
    this.queue = [];
    this.running = false;
    this.xmlhttp = null;
  }

  add(request: Request) {
    this.queue.push(request);
    if (!this.running) {
      this.sendRequest(this.queue.shift()!);
    }
  }

  stop() {
    if (this.running)
      this.running = false;
    if (this.xmlhttp && this.xmlhttp.readyState < 4) {
      this.xmlhttp.abort();
    }
  }

  // TODO make http service for this
  private sendRequest(request: Request) {
    if (!request || !(request instanceof Object))
      return;
    this.running = true;
    const that = this;

    const ajaxCb = (xmlHttpRequest: XMLHttpRequest, d: any /* TODO type */) => {
      return () => {
        if (xmlHttpRequest.readyState == 4) {
          ge('loader')!.style.display = 'none';
          d.callback(xmlHttpRequest.status, xmlHttpRequest.responseText);
          if (that.queue.length === 0)
            that.running = false;
          if (that.running)
            that.sendRequest(that.queue.shift()!);
        }
      }
    }

    ge('loader')!.style.display = 'block';

    let p: string | FormData = '';
    if (request.params instanceof FormData) {
      p = request.params;
    } else if (request.params instanceof Object) {
      p = request.method === 'GET' ? '?' : '';
      p += request.params
        .map((key: string) => encodeURIComponent(key + '=' + request.params[key]))
        .join('&');
    }

    this.xmlhttp = new XMLHttpRequest();
    this.xmlhttp.onreadystatechange = ajaxCb(this.xmlhttp, request);
    if (request.method === 'GET') {
      this.xmlhttp.open(request.method, request.url + p, true);
      this.xmlhttp.send();
    } else {
      this.xmlhttp.open(request.method, request.url, true);
      if (p instanceof String)
        this.xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      this.xmlhttp.send(p);
    }
  }
}

const ge = (a: string) => document.getElementById(a);
