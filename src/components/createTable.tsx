import { Column } from "primereact/column";
import { DataTable, DataTableValue } from "primereact/datatable";
import { useEffect, useRef, useState } from "react";
import "primereact/resources/themes/lara-dark-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { FilterMatchMode } from "primereact/api";
import axios from "axios";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { Paginator } from "primereact/paginator";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";

interface Data {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const DataTableComponent = () => {
  const [todo, setTodo] = useState<Data[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const rowsPerPage = 12;
  const overlayPanelRef = useRef<OverlayPanel>(null);
  const [rowsToSelect, setRowsToSelect] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}`
        );
        const artworks = response.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          place_of_origin: item.place_of_origin,
          artist_display: item.artist_display,
          inscriptions: item.inscriptions,
          date_start: item.date_start,
          date_end: item.date_end,
        }));
        setTodo(artworks);
        setTotalRecords(response.data.pagination.total);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const [filter, setFilter] = useState({
    global: { value: "", matchMode: FilterMatchMode.CONTAINS },
  });
  const [selectedRows, setSelectedRows] = useState<DataTableValue>();
  //const [res, setRes] = useState<DataTableValue<Data>>({});
  const handleChevronClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    overlayPanelRef.current?.toggle(event);
  };

  const handleSelectRows = () => {
    const newSelectedRows = todo.slice(0, Number(rowsToSelect));
    // let remainingRowsToSelect = Number(rowsToSelect);
    // let currentPage = page;
    // let newSelectedRows = [...selectedRows];
    // console.log(selectedRows);

    // while (remainingRowsToSelect > 0 && currentPage <= Math.ceil(totalRecords / rowsPerPage)) {
    //     const startIndex = (currentPage - 1) * rowsPerPage;
    //     const endIndex = startIndex + rowsPerPage;
    //     const rowsOnCurrentPage = todo.slice(startIndex, endIndex).slice(0, remainingRowsToSelect);

    //     newSelectedRows = [...newSelectedRows, ...rowsOnCurrentPage];
    //     remainingRowsToSelect -= rowsOnCurrentPage.length;

    //     if (remainingRowsToSelect > 0) {
    //         currentPage += 1;
    //         setPage(currentPage);
    //     }
    // }
    setSelectedRows(newSelectedRows);
    overlayPanelRef.current?.hide();
  };

  return (
    <>
      <div className="h-[110vh]">
        <div className="p-[3vh] ">
          <div className="flex items-center h-[5.5vh] w-[35vw] bg-[#0f172a] p-3 rounded-xl border border-gray-700 ">
            <FaSearch className="text-xl text-zinc-600" />
            <input
              className="h-[5vh] w-[30vw] p-3 rounded-2xl outline-none bg-[#0f172a] cursor-pointer "
              placeholder="Search Here"
              onInput={(e: React.FormEvent<HTMLInputElement>) =>
                setFilter({
                  global: {
                    value: (e.currentTarget as HTMLInputElement).value,
                    matchMode: FilterMatchMode.CONTAINS,
                  },
                })
              }
            />
          </div>

          <div className="pt-[2vh]">
            <DataTable
              value={todo}
              loading={loading}
              filters={filter}
              selection={selectedRows}
              onSelectionChange={(e) => setSelectedRows(e.value)}
              dataKey="id"
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3em" }}
                header={
                  <div
                    onClick={handleChevronClick}
                    style={{ cursor: "pointer" }}
                  >
                    <FaChevronDown
                      style={{ color: "yellow" }}
                      className="text-xl"
                    />
                  </div>
                }
              />
              <Column field="title" header="Title" sortable />
              <Column
                field="place_of_origin"
                header="Place of Origin"
                sortable
              />
              <Column field="artist_display" header="Artist Display" sortable />
              <Column field="inscriptions" header="Inscriptions" sortable />
              <Column field="date_start" header="Date Start" sortable />
              <Column field="date_end" header="Date End" sortable />
            </DataTable>
            <Paginator
              first={(page - 1) * rowsPerPage}
              rows={rowsPerPage}
              totalRecords={totalRecords}
              rowsPerPageOptions={[10, 20, 30]}
              onPageChange={(e) => setPage(e.page + 1)}
            />
          </div>
        </div>
      </div>

      <OverlayPanel ref={overlayPanelRef}>
        <div className="p-3">
          <h3>Select Rows</h3>
          <input
            type="number"
            value={rowsToSelect}
            onChange={(e) =>
              setRowsToSelect(e.target.value === "0" ? "" : e.target.value)
            }
            className="p-inputtext p-component"
            placeholder="Number of rows"
          />
          <Button label="Select" onClick={handleSelectRows} className="mt-2" />
        </div>
      </OverlayPanel>
    </>
  );
};

export default DataTableComponent;
