import './Admin.scss';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IAdminAddFormData, IAdminRemoveFormData } from '../../types/interfaces';
import useTypedSelector from '../../hooks/useTypedSelector';
import {
  deleteBirdSpecies,
  getAllgenuses,
  getAllpreserves,
  getAllstatuses,
  makeBackup,
  postBirdSpecies,
} from '../../utils/preserves3k6sAPI';
import { genusCard, preserveCard, protectStatusCard } from '../../types/common';

const Admin = () => {
  const addForm = useForm<IAdminAddFormData>();
  const removeForm = useForm<IAdminRemoveFormData>();
  const { cards } = useTypedSelector((state) => state.list);
  const [isCompleteAdd, setIsCompleteAdd] = useState<boolean>(false);
  const [isCompleteRemove, setIsCompleteRemove] = useState<boolean>(false);
  const [statuses, setStatuses] = useState<protectStatusCard[]>([]);
  const [genuses, setGenuses] = useState<genusCard[]>([]);
  const [preserves, setPreserves] = useState<preserveCard[]>([]);

  useEffect(() => {
    const getStatuses = async () => {
      const response = await getAllstatuses();
      if (response === 'error') {
        console.log('error');
      } else {
        const statusesArr = response as protectStatusCard[];
        setStatuses(statusesArr);
      }
    };
    const getGenuses = async () => {
      const response = await getAllgenuses();
      if (response === 'error') {
        console.log('error');
      } else {
        const genusesArr = response as genusCard[];
        setGenuses(genusesArr);
      }
    };
    const getPreserves = async () => {
      const response = await getAllpreserves();
      if (response === 'error') {
        console.log('error');
      } else {
        const preservesArr = response as preserveCard[];
        setPreserves(preservesArr);
      }
    };

    getStatuses();
    getGenuses();
    getPreserves();
  }, []);

  const toggleCompleteAdd = () => {
    setIsCompleteAdd(true);
    setTimeout(() => {
      setIsCompleteAdd(false);
    }, 3000);
  };

  const toggleCompleteRemove = () => {
    setIsCompleteRemove(true);
    setTimeout(() => {
      setIsCompleteRemove(false);
    }, 3000);
  };

  const sendBirdSpecies = async (
    name: string,
    length: number | null,
    weight: number | null,
    wingspan: number | null,
    description: string | null,
    genusId: number,
    protectStatusId: number,
    preserveId: number
  ) => {
    const response = await postBirdSpecies(
      name,
      length,
      weight,
      wingspan,
      description,
      genusId,
      protectStatusId,
      preserveId
    );
    if (response === 'error') {
      console.log('error');
    } else {
      toggleCompleteAdd();
    }
  };

  const removeBirdSpecies = async (speciesId: number) => {
    const response = await deleteBirdSpecies(speciesId);
    if (response === 'error') {
      console.log('error');
    } else {
      toggleCompleteRemove();
    }
  };

  const makeBackupRequest = async () => {
    const response = await makeBackup();
    if (response === 'error') {
      console.log('error');
    } else {
      console.log('backup success');
    }
  };

  const onSubmitAdd: SubmitHandler<IAdminAddFormData> = (data) => {
    const name = String(addForm.getValues('name'));
    const length = addForm.getValues('length');
    const weight = addForm.getValues('weight');
    const wingspan = addForm.getValues('wingspan');
    const description = addForm.getValues('description');
    const genusId = Number(addForm.getValues('genus'));
    const protectStatusId = Number(addForm.getValues('protectStatus'));
    const preserveId = Number(addForm.getValues('preserve'));

    sendBirdSpecies(
      name,
      length,
      weight,
      wingspan,
      description,
      genusId,
      protectStatusId,
      preserveId
    );
    addForm.reset();
  };

  const onSubmitRemove: SubmitHandler<IAdminRemoveFormData> = (data) => {
    const speciesId = Number(removeForm.getValues('species'));

    removeBirdSpecies(speciesId);
    removeForm.reset();
  };

  return (
    <section className="admin-form">
      <div className="center-container">
        <button
          type="button"
          className="btn-backup"
          onClick={() => {
            makeBackupRequest();
          }}
        >
          ?????????? ?? json
        </button>

        <form action="#" className="form" onSubmit={addForm.handleSubmit(onSubmitAdd)}>
          {isCompleteAdd && <p className="form-complete">?????? ????????????????</p>}
          <h2 className="form-title">???????????????? ?????? ????????</h2>
          <input
            className={`form-input input-text ${
              addForm.formState.errors.name ? 'input-error' : null
            }`}
            placeholder="????????????????"
            {...addForm.register('name', { required: true, maxLength: 98 })}
          />
          <p className={`form-error ${addForm.formState.errors.name ? null : 'none'}`}>
            *??????????????????????
          </p>

          <label htmlFor="length" className="form-label">
            <input
              id="length"
              type="number"
              min="0"
              className="form-input input-number"
              placeholder="??????????"
              {...addForm.register('length')}
            />
            ????????(????)
          </label>

          <label htmlFor="weight" className="form-label">
            <input
              id="weight"
              type="number"
              min="0"
              className="form-input input-number"
              placeholder="??????"
              {...addForm.register('weight')}
            />
            ??????????(????)
          </label>

          <label htmlFor="wingspan" className="form-label">
            <input
              id="wingspan"
              type="number"
              min="0"
              className="form-input input-number"
              placeholder="???????????? ??????????????"
              {...addForm.register('wingspan')}
            />
            ????????(????)
          </label>

          <h3 className="form-subtitle">?????????????? ????????????????</h3>
          <input
            className="form-input input-text input-descr"
            {...addForm.register('description')}
          />

          <h3 className="form-subtitle">???????????????? ????????????</h3>
          <select
            className={`form-select ${
              addForm.formState.errors.protectStatus ? 'select-error' : null
            }`}
            defaultValue=""
            {...addForm.register('protectStatus', { required: true })}
          >
            <option className="form-option" value="" disabled>
              ???? ??????????????
            </option>
            {statuses.map((item) => (
              <option key={item.num} className="form-option" value={item.num}>
                {item.longName}
              </option>
            ))}
          </select>
          <p className={`form-error ${addForm.formState.errors.protectStatus ? null : 'none'}`}>
            *???????????????????? ?????????????? ???????? ???? ???????????????? ????????????????
          </p>

          <h3 className="form-subtitle">??????</h3>
          <select
            className={`form-select ${addForm.formState.errors.genus ? 'select-error' : null}`}
            defaultValue=""
            {...addForm.register('genus', { required: true })}
          >
            <option className="form-option" value="" disabled>
              ???? ??????????????
            </option>
            {genuses.map((item) => (
              <option key={item.num} className="form-option" value={item.num}>
                {item.genusName}
              </option>
            ))}
          </select>
          <p className={`form-error ${addForm.formState.errors.genus ? null : 'none'}`}>
            *???????????????????? ?????????????? ???????? ???? ??????????
          </p>

          <h3 className="form-subtitle">????????????????????</h3>
          <select
            className={`form-select ${addForm.formState.errors.preserve ? 'select-error' : null}`}
            defaultValue=""
            {...addForm.register('preserve', { required: true })}
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
          <p className={`form-error ${addForm.formState.errors.preserve ? null : 'none'}`}>
            *???????????????????? ?????????????? ???????? ???? ????????????????????????
          </p>
          <button type="submit" className="btn-submit">
            ????????????????
          </button>
        </form>

        <form action="#" className="form" onSubmit={removeForm.handleSubmit(onSubmitRemove)}>
          {isCompleteRemove && <p className="form-complete">?????? ????????????</p>}

          <h2 className="form-title">?????????????? ?????? ????????</h2>
          <select
            className={`form-select ${removeForm.formState.errors.species ? 'select-error' : null}`}
            defaultValue=""
            {...removeForm.register('species', { required: true })}
          >
            <option className="form-option" value="" disabled>
              ???? ??????????????
            </option>
            {cards.map((item) => (
              <option key={item.num} className="form-option" value={item.num}>
                {item.title}
              </option>
            ))}
          </select>
          <p className={`form-error ${removeForm.formState.errors.species ? null : 'none'}`}>
            *???????????????????? ?????????????? ???????? ???? ??????????
          </p>

          <button type="submit" className="btn-submit">
            ??????????????
          </button>
        </form>
      </div>
    </section>
  );
};

export default Admin;
