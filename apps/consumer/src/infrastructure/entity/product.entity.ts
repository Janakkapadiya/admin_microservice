import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ name: 'product_id', type: 'bigint' })
  id: number;

  @Column('varchar')
  itemName: string;

  @Column({
    name: 'amount',
  })
  amount: number;
}
