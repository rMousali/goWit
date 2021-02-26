import React, { useEffect, useState } from "react";
import { data } from "../data/invoice";
import { Helper } from "../helpers/helperFunction";
import { ColNames } from "../enum/ColNames";
import { IInvoice } from "../interfaces/IInvoice";
import { InvoiceStatus } from "../enum/InvoiceStatus";
import { DownloadOutlined, CloseOutlined } from "@ant-design/icons";
import { Input, Table, Space, Row, Button, Col, Tag, message } from "antd";
import styled from "styled-components";
import FilterSection from "./FilterSection";

const SearchSection = styled(Row)`
  margin-bottom: 1%;
`;
const RowSection = styled(Row)`
  background: white;
  padding: 1%;
`;
const IconSection = styled(Col)`
  display: flex;
  justify-content: flex-end;
`;
const ButtonStyle = styled(Button as any)`
  margin-left: 5%;
`;
const CardButton = styled(Button as any)`
  margin-right: 2%;
  background: #fafafa;
`;

const StyledTag = styled(Tag as any)``;

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState([] as IInvoice[]);
  const [filteredInvoices, setFilteredInvoices] = useState([] as IInvoice[]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filters, setFilters] = useState([] as any[]);
  const status = InvoiceStatus as any;
  const { Search } = Input;

  const getFilterName = (filter: any) => {
    const col = ColNames as any;
    const str = `${col[filter.title]} ${Helper.getCondName(filter.condition)} ${
      filter.value
    }`;
    return str;
  };

  const getInvoiceColor = (value: string) => {
    let color = value === "pending" ? "gold" : "green";
    if (value === "unpaid") {
      color = "red";
    }
    return color;
  };

  const filterCallBack = (filter: any) => {
    const currentFilters = [...filters];
    const alreadyAddedFilter = currentFilters.find(
      (x) =>
        x.title === filter.title &&
        x.value === filter.value &&
        x.condition === filter.condition
    );
    if (!alreadyAddedFilter) {
      currentFilters.push(filter);
    } else {
      message.info(`Bu Filtre Halihazırda Eklenmiş`);
    }
    setFilters(currentFilters);
  };

  const onSearch = (value: any) => {
    let invs = invoices.filter((x) => x.service.indexOf(value) > -1);
    if (value === "") {
      invs = invoices;
    }
    invs = invs.map((y: any) => {
      return { ...y, key: y.id };
    });
    setFilteredInvoices(invs);
  };

  const onRowSelect = (selectedRowKeys: any) => {
    setSelectedRows(selectedRowKeys);
  };
  const rowSelection = {
    selectedRows,
    onChange: onRowSelect,
  };
  const getInvoiceList = () => {
    let res = data as IInvoice[];
    const result = res.map((x) => {
      return { ...x, key: x.id };
    });
    setInvoices(res);
    setFilteredInvoices(result);
  };

  useEffect(() => {
    let currentInvoices = [...invoices];
    currentInvoices = currentInvoices.map((x) => {
      return { ...x, key: x.id };
    });
    let invs: IInvoice[] = currentInvoices;
    filters.forEach((f) => {
      invs = Helper.filterInvoices(invs, f);
    });
    setFilteredInvoices(invs);
  }, [filters, invoices]);

  useEffect(() => {
    getInvoiceList();
  }, [invoices]);

  const downloadInvoice = () => {
    if (selectedRows.length !== filteredInvoices.length) {
      selectedRows.forEach((row) => {
        const invoice = filteredInvoices.find((x) => x.id === row);
        message.info(`${invoice?.invoice_id} Id Numaralı Faturayı İndir`);
      });
    } else {
      message.info(`Tüm Faturaları İndir`);
    }
  };

  const showInvoice = (invoiceId: any) => {
    message.info(`${invoiceId} Id Numaralı Faturanın Detayını Göster `);
  };

  const removeFilter = (filter: any) => {
    const currentFilters = [...filters];
    const idx = currentFilters.indexOf(filter);
    if (idx > -1) {
      currentFilters.splice(idx, 1);
      setFilters(currentFilters);
    }
  };
  const columns = [
    {
      title: "Servis Adı",
      dataIndex: "service",
      sorter: {
        compare: (a: any, b: any) => a.service - b.service,
        multiple: 2,
      },
    },
    {
      title: "Fatura Numarası",
      dataIndex: "invoice_id",
      sorter: {
        compare: (a: any, b: any) => a.invoice_id - b.invoice_id,
        multiple: 2,
      },
    },
    {
      title: "Tarih",
      dataIndex: "date",
      render: (value: any, record: any) => {
        return <span>{Helper.formatDate(record.date)}</span>;
      },
      sorter: {
        compare: (a: any, b: any) => a.date - b.date,
        multiple: 2,
      },
    },
    {
      title: "Tutar",
      dataIndex: "amount",
      onFilter: (value: any, record: any) => record.amount.indexOf(value) === 0,
      sorter: {
        compare: (a: any, b: any) => a.amount - b.amount,
        multiple: 2,
      },
    },
    {
      title: "Durum",
      dataIndex: "values",
      render: (value: any, record: any) => {
        return (
          <StyledTag color={getInvoiceColor(record.status)} key={record.status}>
            {status[record.status].toUpperCase()}
          </StyledTag>
        );
      },
    },
    {
      title: "Action",
      render: (value: any, record: any) => (
        <>
          <Space size="middle">
            <a href="#" onClick={() => showInvoice(record.invoice_id)}>
              Göster
            </a>
          </Space>
        </>
      ),
    },
  ];
  return (
    <div>
      <SearchSection>
        <Col lg={22}>
          <Search
            placeholder="Fatura ara"
            onSearch={onSearch}
            onChange={(e: any) => onSearch(e.target.value)}
            style={{ width: 320 }}
          />
        </Col>
        <IconSection lg={2}>
          <div style={{ float: "left" }}>
            <FilterSection filterCallBack={filterCallBack} />
          </div>
          <ButtonStyle
            icon={<DownloadOutlined />}
            onClick={() => downloadInvoice()}
          ></ButtonStyle>
        </IconSection>
      </SearchSection>
      <RowSection>
        {filters.map((filter, idx) => (
          <CardButton key={idx} onClick={() => removeFilter(filter)}>
            {getFilterName(filter)}
            <CloseOutlined />
          </CardButton>
        ))}
      </RowSection>
      <Table
        columns={columns}
        dataSource={filteredInvoices}
        rowSelection={rowSelection}
      ></Table>
    </div>
  );
}
