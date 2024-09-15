import slugify from 'slugify';
import { v6 } from 'uuid';

function slugGenerator(str: string) {
    const slug = slugify(str, {
        lower: true,
        replacement: '-',
    });
    return slug + '-' + v6();
}

export default slugGenerator;
