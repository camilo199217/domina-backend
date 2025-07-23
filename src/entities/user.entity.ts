import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique, BeforeInsert } from 'typeorm';
import { Task } from './task.entity';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
@Unique('uq_users_email', ['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100, nullable: false })
  fullName!: string;

  @Column({ length: 150, nullable: false })
  email!: string;

  @Column({ length: 100, nullable: false })
  password!: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async checkPassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
