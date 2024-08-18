import { Conversation } from "../entities/Conversation.js";
import { User } from "../entities/User.js";
import { database } from "../services/database.js";

export async function findFreeUser(): Promise<User | null> {
    const userRepository = database.getRepository(User);
    const conversationRepository = database.getRepository(Conversation);

    const result = await conversationRepository
        .createQueryBuilder('conversation')
        .select('user.id', 'userId')
        .addSelect('COUNT(conversation.id)', 'conversationCount')
        .innerJoin('conversation.user', 'user')
        .groupBy('user.id')
        .orderBy('COUNT(conversation.id)', 'ASC')
        .addOrderBy('user.createdAt', 'DESC')
        .limit(1)
        .getRawOne();

    if (!result) {
        const fallbackUser = await userRepository.findOne({
            order: {
                createdAt: 'DESC'
            }
        });
        return fallbackUser || null;
    }

    return await userRepository.findOne({
        where: { id: result.userId }
    });
}