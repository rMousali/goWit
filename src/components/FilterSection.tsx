import React, { useState } from "react";
import { schema } from "../data/invoice";
import { ConditionsAbb } from "../enum/ConditionsAbb";
import { FilterOutlined } from "@ant-design/icons";
import { Space, Button, Popover, Select, InputNumber, DatePicker } from "antd";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  min-width: 416px;
`;
const FilterValueSection = styled.div`
  margin-right: 5%;
`;
const FilterButtonSection = styled.div`
  margin-top: 5%;
  display: flex;
  justify-content: flex-end;
`;

const ButtonStyle = styled(Button as any)`
  margin-left: 5%;
`;

const Btn = styled(Button as any)``;

const { Option } = Select as any;

export interface FilterSectionsProps {
  filterCallBack: any;
}
export interface FilterSectionsState {}

export default function FilterSection({ filterCallBack }: FilterSectionsProps) {
  const schemaData = schema as any;
  const [open, setOpen] = useState(false);
  const conditions = ConditionsAbb as any;
  const [filter, setFilter] = useState({} as any);

  const handleClose = () => {
    setOpen(false);
  };

  const getOptions = () => {
    if (filter?.title) {
      let arr: any[] = [];
      schemaData[filter.title].ops.forEach((element: any) => {
        arr.push({ text: conditions[element], value: element });
      });
      return arr;
    }
    return [];
  };

  const printValueSection = () => {
    if (filter?.title) {
      const currentSchema = schemaData[filter.title];
      switch (currentSchema.type) {
        case "multiselect":
          return (
            <Select
              defaultValue="Seçin"
              style={{ width: 120 }}
              onChange={(value) => handleChange("value", value)}
            >
              {currentSchema.values.map((opt: any, idx: any) => {
                return (
                  <Option value={opt} key={idx}>
                    {opt}
                  </Option>
                );
              })}
            </Select>
          );
        case "money":
          return (
            <InputNumber
              onChange={(value: any) => handleChange("value", value)}
            />
          );
        case "datetime":
          return (
            <DatePicker
              showTime
              onChange={(value: any) => handleChange("value", value)}
              onOk={(value: any) => handleChange("value", value)}
            />
          );
      }
    }
  };

  const handleChange = (title: any, value: any) => {
    const copiedFilter = { ...filter } as any;
    copiedFilter[title] = value;
    setFilter(copiedFilter);
  };
  const content = (
    <>
      <Wrapper>
        <FilterValueSection>
          <p>Baslik</p>
          <div>
            <Space>
              <Select
                defaultValue="Seçin"
                style={{ width: 120 }}
                onChange={(value) => handleChange("title", value)}
                value={filter?.title}
              >
                {Object.keys(schemaData).map((key, idx) => {
                  return (
                    <Option key={idx} value={key}>
                      {schemaData[key].name}
                    </Option>
                  );
                })}
              </Select>
            </Space>
          </div>
        </FilterValueSection>
        <FilterValueSection>
          <p>Kosul</p>
          <div>
            <Space>
              <Select
                defaultValue="Seçin"
                style={{ width: 120 }}
                onChange={(value) => handleChange("condition", value)}
              >
                {getOptions().map((cond: any, idx: number) => (
                  <Option value={cond.value} key={idx}>
                    {cond.text}
                  </Option>
                ))}
              </Select>
            </Space>
          </div>
        </FilterValueSection>
        <FilterValueSection>
          <p>Deger</p>
          <div>
            <Space>{printValueSection()}</Space>
          </div>
        </FilterValueSection>
      </Wrapper>
      <FilterButtonSection>
        <Btn onClick={() => handleClose()}>İptal</Btn>
        <ButtonStyle type="primary" onClick={() => filterCallBack(filter)}>
          Ekle
        </ButtonStyle>
      </FilterButtonSection>
    </>
  );
  return (
    <Popover
      placement="leftTop"
      title={"Filtre Ekle"}
      content={content}
      trigger="click"
      visible={open}
      onVisibleChange={(value: React.SetStateAction<boolean>) => setOpen(value)}
    >
      <Btn icon={<FilterOutlined />} />
    </Popover>
  );
}
