import { useMemo, useState } from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string';
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
  // что касается данного свойства, то его предназначение из задания не понятно, поэтому я его закомментировал
  // colors: Color[];
}

const DEFAULT_PARAMS: Param[] = [
  {
    id: 1,
    name: 'Назначение',
    type: 'string',
  },
  {
    id: 2,
    name: 'Длина',
    type: 'string',
  },
];

const DEFAULT_MODEL: Model = {
  paramValues: [
    {
      paramId: 1,
      value: 'повседневное',
    },
    {
      paramId: 2,
      value: 'макси',
    },
  ],
};

interface ParamListEditorProps {
  params: Param[];
  model: Model;
  onChange: (paramId: Param['id'], value: ParamValue['value']) => void;
}

function ParamListEditor({ model, params, onChange }: ParamListEditorProps) {
  const modelData = useMemo(() => {
    const paramsHashMap: Record<Param['id'], number> = {};
    params.forEach((param, index) => {
      paramsHashMap[param.id] = index;
    });

    const paramValuesHashMap: Record<ParamValue['paramId'], number> = {};
    model.paramValues.forEach((paramValue, index) => {
      paramValuesHashMap[paramValue.paramId] = index;
    });

    //проверяем все ли paramValue имеют соответствующий param
    let isParamValuesCorrect = true;
    for (const paramValue of model.paramValues) {
      if (paramsHashMap[paramValue.paramId] === undefined) {
        isParamValuesCorrect = false;
        break;
      }
    }

    //проверяем все ли param имеют соответствующие значения
    let isParamsCorrect = true;
    for (const param of params) {
      if (paramValuesHashMap[param.id] === undefined) {
        isParamsCorrect = false;
        break;
      }
    }

    return {
      paramsHashMap,
      paramValuesHashMap,
      isModelCorrect: isParamValuesCorrect && isParamsCorrect,
    };
  }, [model, params]);

  if (!modelData.isModelCorrect) {
    return <div>модель содержит ошибки</div>;
  }

  return (
    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
      {params.map((param) => (
        <div key={param.id}>
          <ParamEditor
            type={param.type}
            value={
              model.paramValues[modelData.paramValuesHashMap[param.id]]?.value
            }
            name={param.name}
            onChange={(value) => onChange(param.id, value)}
          />
        </div>
      ))}
    </div>
  );
}

interface ParamEditorProps {
  type: Param['type'];
  value: ParamValue['value'];
  name: Param['name'];
  onChange: (value: ParamValue['value']) => void;
}

function ParamEditor({ onChange, type, value, name }: ParamEditorProps) {
  //в общем тут по пропсу type определяем какой тип редактора нам нужен и подключаем соответствующую форму для редактирования
  if (type === 'string') {
    const handleChange = (value: string) => {
      onChange(value);
    };
    return (
      <div style={{ display: 'flex', gap: '20px' }}>
        <label>{name}</label>
        <input value={value} onChange={(e) => handleChange(e.target.value)} />
      </div>
    );
  }

  return (
    <div>{`для параметра с типом ${type} нет возможности подключить соответствующий редактор`}</div>
  );
}

export function App() {
  const [model, setModel] = useState<Model>(DEFAULT_MODEL);

  const handleGetModel = () => {
    console.log(model);
    alert('содержимое модели выведено в консоль браузера');
  };

  const handleChangeModel = (
    paramId: Param['id'],
    value: ParamValue['value'],
  ) => {
    setModel((prev) => {
      return {
        ...prev,
        paramValues: prev.paramValues.map((el) => {
          if (el.paramId === paramId) {
            return { paramId, value };
          }
          return el;
        }),
      };
    });
  };

  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        gap: '20px',
        flexDirection: 'column',
      }}
    >
      <ParamListEditor
        model={model}
        params={DEFAULT_PARAMS}
        onChange={handleChangeModel}
      />
      <button
        onClick={handleGetModel}
        style={{ maxWidth: 'fit-content', padding: '10px' }}
      >
        getModel
      </button>
    </div>
  );
}
