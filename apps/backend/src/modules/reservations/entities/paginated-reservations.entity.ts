import { ObjectType } from "@nestjs/graphql";
import { Reservation } from "./reservation.entity";
import { Paginated } from "../../../common/pagination/paginated.type";

@ObjectType()
export class PaginatedReservations extends Paginated(Reservation) {}
