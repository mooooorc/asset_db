
import './button.css'
import { IconPlus } from '@tabler/icons-react';

type ButtonProps = {
    label: string,
    onClick: () => void
}


export const Button = ({label, onClick}: ButtonProps) => {

    return (
        <button className="button" onClick={onClick}>
            <IconPlus size={16} stroke={2} className="icon"/>
            <span className="label">{label}</span>
            </button>
    )

}