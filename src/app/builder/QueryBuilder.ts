import { FilterQuery, Model, Query } from 'mongoose';

class QueryBuilder<T> {
    public QueryModel: Query<T[], T>;
    private query: Record<string, unknown>;

    constructor(Model: Model<T>, query: Record<string, unknown>) {
        this.QueryModel = Model.find();
        this.query = query;
    }

    search(searchAbleFields: string[]) {
        const { searchTerm } = this.query;

        if (searchTerm) {
            this.QueryModel = this.QueryModel.find({
                $or: searchAbleFields.map((field) => ({
                    [field as string]: { $regex: searchTerm || '', $options: 'i' },
                })),
            } as FilterQuery<T>);
        }

        return this;
    }

    filter(excludeFields: string[] = []) {
        const query = { ...this.query };
        const deletedFields = ['sort', 'page', 'limit', 'searchTerm', 'fields', ...excludeFields];
        deletedFields.forEach((field) => delete query[field]);

        if (!Object.values(query).length) {
            return this;
        }

        this.QueryModel = this.QueryModel.find(query as FilterQuery<T>);
        return this;
    }

    paginate() {
        const page = (this.query?.page as number) || 1;
        const limit = (this.query?.limit as number) || 10;

        const skip = (page - 1) * limit;

        this.QueryModel = this.QueryModel.skip(skip).limit(limit);

        return this;
    }

    sort() {
        const sort = this.query?.sort || '-createdAt';
        this.QueryModel = this.QueryModel.sort(sort as FilterQuery<T>);
        return this;
    }
    fields() {
        const excludeFields = (this.query?.fields as string)?.split(',')?.join(' ') || '-__v';
        this.QueryModel = this.QueryModel.select(excludeFields);
        return this;
    }
}
export default QueryBuilder;
