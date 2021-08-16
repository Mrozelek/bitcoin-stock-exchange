export class StockBuilder {
  setName(name) {
    this.name = name.toUpperCase();
    return this;
  }

  setChange(change) {
    this.change = change;
    return this;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }

  setCap(cap) {
    this.cap = cap;
    return this;
  }

  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
    return this;
  }

  build() {
    return ({
      uuid: this.name,
      name: this.name,
      change: this.change,
      price: this.price,
      cap: this.cap,
      imageUrl: this.imageUrl
    });
  }
}
