import { IconSearch } from '@tabler/icons-react';
import './search.css'


export const Search = () => {
    return (
        <div className="search">
            <input type="search" className="input" />
            <button className="button">
            <IconSearch size={16} stroke={2} className="icon"/>
            </button>

        </div>
    )
}