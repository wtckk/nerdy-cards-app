import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO для вывода карточки с ее прогрессом
 */
export class CardWithProgressDto {
  @ApiProperty({
    description: 'Уникальный идентификатор карточки UUID',
  })
  id: string;

  @ApiProperty({
    description: 'Термин',
  })
  term: string;

  @ApiProperty({
    description: 'Определение',
  })
  definition: string;

  @ApiProperty({
    description: 'Позиция карточки в папке',
  })
  position: number;

  @ApiProperty({
    description: 'Статус изучения карточек',
  })
  isLearned: boolean;
}
