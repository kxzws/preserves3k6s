import './DonateForm.scss';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IDonateFormData } from '../../types/interfaces';
import useTypedSelector from '../../hooks/useTypedSelector';
import useActions from '../../hooks/useActions';
import { getAllpreserves, postDonate } from '../../utils/preserves3k6sAPI';
import { preserveCard } from '../../types/common';

const DonateForm = () => {
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<IDonateFormData>();
  const { favourites } = useTypedSelector((state) => state.list);
  const { nickname, isAuthorized } = useTypedSelector((state) => state.auth);
  const { clearFavourites } = useActions();
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [preserves, setPreserves] = useState<preserveCard[]>([]);

  useEffect(() => {
    const getPreserves = async () => {
      const response = await getAllpreserves();
      if (response === 'error') {
        console.log('error');
      } else {
        const preservesArr = response as preserveCard[];
        setPreserves(preservesArr);
      }
    };
    getPreserves();
  }, []);

  const toggleComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      setIsComplete(false);
    }, 3000);
  };

  const sendDonate = async (species: number[], preserve: number, amount: number) => {
    const response = await postDonate(species, preserve, amount, nickname as string);
    if (response === 'error') {
      console.log('error');
    } else {
      toggleComplete();
    }
  };

  const onSubmit: SubmitHandler<IDonateFormData> = (data) => {
    const preserve = Number(getValues('preserve'));
    const donate = Number(getValues('donate'));
    // const cardNumber = getValues('cardNumber');
    // const cardDate = getValues('cardDate');
    // const cardCVV = getValues('cardCVV');

    const speciesArr = favourites.map((item) => item.num);
    sendDonate(speciesArr, preserve, donate);
    reset();
    clearFavourites();
  };

  return (
    <section className="donate-form">
      <div className="center-container">
        <form action="#" className="form" onSubmit={handleSubmit(onSubmit)}>
          {isComplete && <p className="form-complete">?????????? ??????????????????</p>}

          <h2 className="form-title">?????????? ????????????</h2>
          <h3 className="form-subtitle">???????????? ?????????????????? ??????????</h3>
          <ul className="form-list">
            {favourites.map((item) => (
              <li key={item.num} className="form-item">
                {item.title}
              </li>
            ))}
          </ul>

          <h3 className="form-subtitle">????????????????????</h3>
          <select
            className={`form-select ${errors.preserve ? 'select-error' : null}`}
            defaultValue=""
            {...register('preserve', { required: true })}
          >
            <option className="form-option" value="" disabled>
              ???? ??????????????
            </option>
            {preserves.map((item) => (
              <option key={item.num} className="form-option" value={item.num}>
                {item.presName}
              </option>
            ))}
          </select>
          <p className={`form-error ${errors.preserve ? null : 'none'}`}>
            *???????????????????? ?????????????? ???????? ???? ????????????????????????
          </p>

          <h3 className="form-subtitle">???????????? ????????????</h3>
          <label htmlFor="donate" className="form-label">
            <input
              id="donate"
              type="number"
              min="1"
              defaultValue="1"
              className={`form-input input-number ${errors.donate ? 'input-error' : null}`}
              {...register('donate', { required: true })}
            />
            USD
          </label>
          <p className={`form-error ${errors.donate ? null : 'none'}`}>*??????????????????????</p>

          <h2 className="form-title">??????????</h2>
          <div className="card-group">
            <input
              type="number"
              min="1000000000000000"
              max="9999999999999999"
              defaultValue="1234123412341234"
              className={`form-input input-number input-card ${
                errors.cardNumber ? 'input-error' : null
              }`}
              placeholder="?????????? ??????????"
              {...register('cardNumber', { required: true, minLength: 16, maxLength: 16 })}
            />
            <p className={`form-error ${errors.cardNumber ? null : 'none'}`}>*??????????????????????</p>

            <input
              type="month"
              className={`form-input input-date ${errors.cardDate ? 'input-error' : null}`}
              {...register('cardDate', { required: true })}
            />
            <p className={`form-error ${errors.cardDate ? null : 'none'}`}>*??????????????????????</p>

            <input
              type="number"
              min="100"
              max="999"
              defaultValue="999"
              className={`form-input input-number input-code ${
                errors.cardCVV ? 'input-error' : null
              }`}
              placeholder="CVV"
              {...register('cardCVV', { required: true, minLength: 3, maxLength: 3 })}
            />
            <p className={`form-error ${errors.cardCVV ? null : 'none'}`}>
              *???????????????????????? ???????? ???? ???????? ????????
            </p>
          </div>

          {!isAuthorized ? (
            <NavLink to="/login" className="btn-submit btn-login">
              ??????????
            </NavLink>
          ) : (
            <button type="submit" className="btn-submit">
              ??????????????????
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default DonateForm;
