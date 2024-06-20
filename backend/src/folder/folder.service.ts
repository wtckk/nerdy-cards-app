import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './entites/folder.entity';
import { Repository } from 'typeorm';
import { CreateFolderDto } from './dtos/create-folder.dto';
import { FolderDto } from './dtos/folder.dto';
import { UpdateFolderDto } from './dtos/update-folder.dto';
import { ProfileService } from '../profile/profile.service';
import { CardService } from '../card/card.service';
import { CreateCardDto } from '../card/dtos/create-card.dto';

@Injectable()
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
    private readonly profileService: ProfileService,
    private readonly cardService: CardService,
  ) {}

  /**
   * Получение списка всех созданных папок (отсортированные)
   */
  async getAllFolder(): Promise<Folder[]> {
    const folders = await this.folderRepository.find({
      order: {
        createdAt: 'desc',
      },
      relations: ['profile'],
    });
    return folders;
  }

  /**
   * Получение папок пользователя (отсортированные)
   */
  async getFolderByUser(userId: string): Promise<FolderDto[]> {
    const profile = await this.profileService.getProfileByUserId(userId);
    const folders = await this.folderRepository.find({
      where: {
        profile: {
          id: profile.id,
        },
      },
      order: {
        createdAt: 'desc',
      },
      relations: ['profile', 'cards'],
    });
    return folders;
  }

  /**
   * Получение папки по ID
   */
  async getFolderById(id: string) {
    const folder = await this.folderRepository.findOne({
      where: { id: id },
      relations: ['profile', 'cards'],
    });
    if (!folder) {
      throw new BadRequestException({
        message: 'ID не найден',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return folder;
  }

  /**
   * Создание папки вместе с карточками
   */
  async createFolder(dto: CreateFolderDto, userId: string) {
    const profile = await this.profileService.getProfileByUserId(userId);
    try {
      const folder = this.folderRepository.create({
        title: dto.title,
        description: dto.description,
        profile: profile,
      });
      const savedFolder = await this.folderRepository.save(folder);

      // Проверяем на наличие карточек в модуле
      if (dto.cards.length === 0) {
        throw new BadRequestException({
          message: 'Отсутствуют карточки',
          status: HttpStatus.BAD_REQUEST,
        });
      }
      // Создаем карточки с использованием folderId
      const cards: CreateCardDto[] = dto.cards.map((cardDto) => ({
        ...cardDto,
        folderId: savedFolder.id,
      }));
      await this.cardService.createCard(cards);

      return savedFolder;
    } catch (error) {
      throw new BadRequestException({
        message: 'Ошибка создания модуля',
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  /**
   * Обновление данных папок
   */
  async updateFolder(id: string, dto: UpdateFolderDto) {
    const folder = await this.getFolderById(id);
    if (!folder) {
      throw new BadRequestException({
        message: 'ID не существует',
        status: HttpStatus.BAD_REQUEST,
      });
    }
    await this.folderRepository.save({ ...folder, ...dto });
    return {
      message: 'Папка успешно обновлена',
      status: HttpStatus.OK,
    };
  }
}
