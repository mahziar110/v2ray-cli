const fs = require('fs');

export class File {
  private path: string;
  constructor(path: string) {
    this.path = path;
  }

  public write(data: {}) {
    const jsonString = JSON.stringify(data, null, 2);

    fs.writeFile(this.path, jsonString, 'utf8', (err: {}) => {
      if (err) {
        console.error('Error writing to file:', err);
        return;
      }
    });
  }

  public read() {
    let dd = '';
    fs.readFile(this.path, 'utf8', (err: {}, data: any) => {
      console.log(data);
      console.log(err);
      dd = data;
    });

    return dd;
  }
}