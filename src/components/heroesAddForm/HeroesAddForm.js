import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { addHero } from "../../actions";
import {useHttp} from "../../hooks/http.hook";

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [element, setElement] = useState('');
    const {filters, filtersLoadingStatus} = useSelector(state => state);
    const {request} = useHttp();
    const dispatch = useDispatch();

    const newHero = {
        id: uuidv4(),
        name,
        description,
        element
    }

    const resetForm = () => {
        setName('');
        setDescription('');
        setElement('');
    }

    const addNewHero = (e, obj) => {
        e.preventDefault();
        request("http://localhost:3001/heroes", 'POST', JSON.stringify(obj))
            .then(dispatch(addHero(obj)))
            .catch(err => console.log(err))
        resetForm();
    }

    const filtersOption = (arr, status) => {
        if (status === 'loading') {
            return <option>Елементы грузятся</option>
        } else if (status === 'error') {
            return <option>Ошибка загрузки елементов</option>
        }

        if (arr && arr.length > 0) {
            return arr.map(({name, label}) => {
                if (name === 'all') return;
                return <option key={name} value={name}>{label}</option>
            })
        }
    }

    return (
        <form onSubmit={(e) => addNewHero(e,newHero)} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    value={element}
                    onChange={(e) => setElement(e.target.value)}
                    className="form-select" 
                    id="element" 
                    name="element">
                    <option >Я владею элементом...</option>
                    {filtersOption(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;