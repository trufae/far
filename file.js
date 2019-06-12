const fs = require('fs');

class File {
  constructor (fileName) {
    this.fileName = fileName;
    this.From = 0;
    this.To = 0;
    this.Cur = 0;
    this.text = fileName ? fs.readFileSync(fileName).toString() : '';
  }

  find (text, inc) {
    const i = this.text.indexOf(text);
    if (i === -1) {
      throw new Error('cannot find pattern');
    }
    this.Cur = i + (inc || 0);
    return this;
  }
  from () {
    this.From = this.Cur;
    return this;
  }
  to () {
    this.To = this.Cur;
    return this;
  }
  findBack (text, inc) {
    const t = this.text.substring(0, this.From ? this.From : this.text.length);
    const i = t.lastIndexOf(text);
    if (i === -1) {
      throw new Error('cannot find pattern');
    }
    this.Cur = i + (inc || 0);
    return this;
  }
  after (text, inc) {
    const t = this.text.substring(this.Cur, this.To || this.text.length);
    const i = t.indexOf(text);
    if (i === -1) {
      throw new Error('cannot find pattern');
    }
    this.Cur += i + (inc || 0);
    return this;
  }
  trim () {
    const a = this.text.substring(0, this.From);
    const b = this.To ? this.text.substring(this.To) : '';
    const t = this.text.substring(this.From, this.To || this.text.length);
    const r = t.split('\n').filter(_ => _.trim().length !== 0).join('\n');
    this.text = a + r + b;
    return this.reset();
  }
  crop () {
    const t = this.text.substring(this.From, this.To || this.text.length);
    this.text = t;
    return this.reset();
  }
  between (a, b) {
    return this.after(a).prevLine().from().after(b).nextLine().to();
  }
  reset () {
    this.From = 0;
    this.To = 0;
    return this;
  }
  before (text, inc) {
    const t = this.text.substring(this.Cur);
    const i = t.indexOf(text);
    if (i !== -1) {
      this.Cur = this.Cur + i + (inc || 0);
    }
    return this;
  }
  prevLine () {
    const t = this.text.substring(0, this.Cur);
    const i = t.lastIndexOf('\n');
    if (i === -1) {
      throw new Error('cannot find pattern');
    }
    this.Cur = i + 1;
    return this;
  }
  gotoLine (ln) {
    const lines = this.text.split('\n');
    let seek = 0;
    let count = 0;
    for (let line of lines) {
      seek += line.length;
      count++;
      if (count >= ln) {
        break;
      }
    }
    this.Cur = seek;
    return this;
  }
  nextLine () {
    return this.after('\n', 1);
  }
  assert (text) {
    const t = this.text.substring(this.From, this.To || this.text.length);
    const i = t.indexOf(text);
    if (i !== -1) {
      throw new Error('uniq text match');
    }
    return this;
  }
  sort () {
    this.text = this.text.split(/\n/g).sort().join('\n');
    this.Cur = this.From = this.To = 0;
    return this;
  }
  insert (text) {
    const a = this.text.substring(0, this.From);
    const b = this.text.substring(this.From);
    this.To += text.length;
    this.text = a + text + b;
    return this;
  }
  append (text) {
    const a = this.text.substring(0, this.To);
    const b = this.To ? this.text.substring(this.To) : '';
    this.To += text.length;
    this.text = a + text + b;
    return this;
  }
  replace (text, text2) {
    const t = this.text.substring(this.From, this.To || this.text.length);
    const r = t.replace(text, text2);
    const a = this.text.substring(0, this.From);
    const b = this.To ? this.text.substring(this.To) : '';
    if (this.To) {
      this.To += text2.length - text.length;
    }
    this.text = a + r + b;
    return this;
  }
  toString () {
    return this.text.toString();
  }
  printBlock () {
    const t = this.text.substring(this.From, this.To || this.text.length);
    console.log('' + t);
    return this;
  }
  printLine () {
    const t = this.text.substring(this.From, this.To || this.text.length);
    const nl = t.indexOf('\n');
    if (nl !== -1) {
      console.log('' + t.substring(0, nl));
    } else {
      console.log('' + t);
    }
    return this;
  }
  printFileName () {
    console.log('\x1b[32m' + this.fileName + '\x1b[0m');
    return this;
  }
  print () {
    console.log('' + this.toString());
    return this;
  }
  grep (expr) {
    this.reset();
    this.text = this.text.split('\n').filter(_ => _.indexOf(expr) !== -1).join('\n');
    return this;
  }
  igrep (expr) {
    this.reset();
    this.text = this.text.split('\n').filter(_ => _.indexOf(expr) === -1).join('\n');
    return this;
  }
  save (fileName) {
    fs.writeFileSync(fileName || this.fileName, this.text);
    return this;
  }
  help () {
    console.error('Attributes', Object.keys(this));
    console.error('Methods');
    console.error(' .find(pattern)    find the first match of given pattern');
    console.error(' .findBack(pattern)find the previous match of given pattern');
    console.error(' .after(pattern)   find the next match of given pattern');
    console.error(' .gotoLine(num)    seek to the nth text line');
    console.error(' .nextLine()       seek to the next line');
    console.error(' .prevLine()       seek back to the previous line');
    console.error(' .before(pattern)  restrict the limit of the operations');
    console.error(' .between(a,b)     set from() and to() to the text between those lines');
    console.error(' .from()           set the from mark');
    console.error(' .to()             set the to mark');
    console.error(' .reset()          reset current block selection');
    console.error(' .grep(text)       filter text by grepping lines');
    console.error(' .igrep(text)      inverse filter text by grepping lines');
    console.error(' .replace(a,b)     replace text in selected bound');
    console.error(' .replaceLines(a,b,c) replace b with c in all the lines matching a');
    console.error(' .insert(text)     insert text in the current position');
    console.error(' .append(text)     append text at the end of the selection or file');
    console.error(' .sort()           sort the lines alphabetically');
    console.error(' .print()          print the buffer');
    console.error(' .printLine()      print current line in the buffer');
    console.error(' .printBlock()     print selected block');
    console.error(' .printFileName()  print the current selected file');
    console.error(' .save(path)       save result to a different file');
    console.error(' .assert(text)     throw if the text exists in selected block');
    console.error(' .save()           overwrite file contents');
    return this;
  }
}

module.exports = File;
