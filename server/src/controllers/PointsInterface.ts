import Item from "./ItemInterface";

interface Point {
    id: number,
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string,
    latitude: number,
    longitude: number,
    items: Array<Item>
}

export default Point;