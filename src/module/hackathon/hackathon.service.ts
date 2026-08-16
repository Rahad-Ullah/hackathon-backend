import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../lib/database/prisma.service';
import {
  CreateHackathonDto,
  QueryHackathonDto,
  UpdateHackathonDto,
} from './dto';

@Injectable()
export class HackathonService {
  constructor(private readonly prisma: PrismaService) {}

  async create(authorId: string, createHackathonDto: CreateHackathonDto) {
    const { startDate, endDate, ...rest } = createHackathonDto;

    return this.prisma.hackathon.create({
      data: {
        ...rest,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async findAll(query: QueryHackathonDto) {
    const { search, isActive, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [total, hackathons] = await this.prisma.$transaction([
      this.prisma.hackathon.count({ where }),
      this.prisma.hackathon.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          _count: {
            select: {
              participants: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      hackathons,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        _count: {
          select: {
            participants: true,
          },
        },
      },
    });

    if (!hackathon) {
      throw new NotFoundException(`Hackathon with ID "${id}" not found`);
    }

    return hackathon;
  }

  async update(
    id: string,
    userId: string,
    userRole: string,
    updateHackathonDto: UpdateHackathonDto,
  ) {
    const hackathon = await this.findOne(id);

    if (hackathon.authorId !== userId && userRole !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to update this hackathon',
      );
    }

    const { startDate, endDate, ...rest } = updateHackathonDto;

    return this.prisma.hackathon.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async delete(id: string, userId: string, userRole: string) {
    const hackathon = await this.findOne(id);

    if (hackathon.authorId !== userId && userRole !== 'admin') {
      throw new ForbiddenException(
        'You do not have permission to delete this hackathon',
      );
    }

    return this.prisma.hackathon.delete({
      where: { id },
    });
  }

  async join(id: string, userId: string) {
    const hackathon = await this.findOne(id);

    if (!hackathon.isActive) {
      throw new BadRequestException('Hackathon is not active');
    }

    if (new Date() > new Date(hackathon.endDate)) {
      throw new BadRequestException('Hackathon has already ended');
    }

    try {
      return await this.prisma.hackathonParticipant.create({
        data: {
          hackathonId: id,
          userId,
        },
        include: {
          hackathon: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('You have already joined this hackathon');
      }
      throw error;
    }
  }
}
