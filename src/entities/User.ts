import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    Unique
} from "typeorm";

import { v4 as uuid } from 'uuid'

@Entity('users')
export class User {
    @Unique('uniqueEmail', ['email'])

    @PrimaryColumn()
    id: string;

    @Column()
    email: string;

    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if (!this.id) {
            this.id = uuid()
        }
    }
}
