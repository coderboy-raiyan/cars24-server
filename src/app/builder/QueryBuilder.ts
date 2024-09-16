import { FilterQuery, Model, Query } from 'mongoose';

type TModelQuery<T> = Query<T[], T>;

class QueryBuilder<T> {
    public ModelQuery: TModelQuery<T>;
    private query: Record<string, unknown>;
    constructor(ModelQuery: Model<T>, params: Record<string, unknown>) {
        this.ModelQuery = ModelQuery.find();
        this.query = params;
    }

    search<T>(searchFields: string[]) {
        const { searchTerm } = this.query;
        if (searchTerm) {
            this.ModelQuery = this.ModelQuery.find({
                $or: searchFields.map((field) => ({
                    [field]: { $regex: searchTerm, $options: 'i' },
                })),
            } as FilterQuery<T>);
        }
        return this;
    }

    filter<T>(extraOmitFields: string[] = []) {
        const omitFields = ['page', 'sort', 'limit', 'searchTerm', 'fields', ...extraOmitFields];
        const params = { ...this.query };
        omitFields.forEach((field) => {
            delete params[field];
        });

        if (Object.values(params)?.length) {
            this.ModelQuery = this.ModelQuery.find(params as FilterQuery<T>);
        }
        return this;
    }

    paginate() {
        const page = parseInt(this.query?.page as string) || 1;
        const limit = parseInt(this.query?.page as string) || 10;
        const skip = (page - 1) * limit;

        this.ModelQuery = this.ModelQuery.skip(skip).limit(limit);

        return this;
    }

    sort() {
        const sortField = this.query?.sort || '-createdAt';
        this.ModelQuery = this.ModelQuery.sort(sortField as string);
        return this;
    }
    fields() {
        const fields = (this.query?.fields as string)?.split(',')?.join(' ') || '-__v';
        this.ModelQuery = this.ModelQuery.select(fields as string);
        return this;
    }
}

export default QueryBuilder;
