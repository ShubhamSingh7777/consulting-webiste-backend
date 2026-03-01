import { UsersService } from './users.service';
import { CreateUserDto, UpdateLeadStatusDto, UserQueryDto } from './dto/user.dto';
export declare class UsersController {
    private readonly svc;
    constructor(svc: UsersService);
    create(dto: CreateUserDto): Promise<import("./entities/user.entity").User>;
    findAll(query: UserQueryDto): Promise<{
        data: import("./entities/user.entity").User[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getStats(): Promise<{
        total: number;
        newLeads: number;
        contacted: number;
        closedWon: number;
        byService: any[];
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    updateStatus(id: string, dto: UpdateLeadStatusDto): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
