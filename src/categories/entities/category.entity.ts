import { Post } from "src/posts/entities/post.entity";
import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : 'categories'})
export class Category{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    name: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updated_at: Date;

    @JoinTable({joinColumn: {name: 'id_category'}})
    @OneToMany(() => Post, post => post.id)
    post: Post
}