import { Card } from '../entites/card.entity';
import { CardProgress } from '../entites/card-progress.entity';
import { CardWithProgressDto } from '../dtos/card-with-progress.dto';

export const mapCardWithProgress = (
  card: Card,
  cardProgress: CardProgress,
): CardWithProgressDto => ({
  id: card.id,
  term: card.term,
  definition: card.definition,
  position: card.position,
  isLearned: cardProgress.isLearned,
});