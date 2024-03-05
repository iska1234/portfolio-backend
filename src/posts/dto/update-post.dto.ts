
export class UpdatePostDto {
    name?: string;
    brief?: string;
    content?: string;
    id_category?: number;
    image1?: string;
    image2?: string;
    image3?: string;
    images_to_update?: Array<number>;
}
