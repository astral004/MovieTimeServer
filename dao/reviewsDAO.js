import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {

    static async injectDB(conn) {
        if(reviews) {
            return;
        }
        try {
            reviews = await conn.db(process.env.MOVIEREVIEWS_COLLECTION)
                .collection('reviews');
        } catch (e) {
            console.error(`Unable to connect to reviewsDAO: ${e}`);
        }
    }

    static async addReview(movieId, user, review, date) {
        try{
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: new ObjectId(movieId),
            }
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return {error: e};
        }
    }

    static async updateReview(reviewId, user, review, date) {
        try{
            const response = await reviews.updateOne(
                {_id: new ObjectId(reviewId), user_id: user._id},
                {$set: {
                        date: date,
                        review: review
                    }
                }
            );
            if(response.modifiedCount === 1){
                return response;
            } else {
                throw new Error("No objects were modified!");
            }
        } catch (e) {
            console.error(`Unable to put update to review: ${e}`);
            return {error: e};
        }
    }

    static async deleteReview(reviewId, userId) {
        try{
            const response = await reviews.deleteOne(
                {_id: new ObjectId(reviewId), user_id: userId}
            );
            if(response.deletedCount === 1){
                return response;
            } else {
                throw new Error("No objects were deleted!");
            }
        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return {error: e};
        }
    }
}