import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
// import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import BusinessDataTable from "../../components/tables/DataTables/Business";
// import {listProducts} from "../../endpoints/api";

export default function BusinessTable() {

  return (
    <>
      <PageMeta
        title="Negocios"
        description=""
      />
      <PageBreadcrumb pageTitle="Negocios" />
      <div className="space-y-6">
        <ComponentCard title="Tabla de Negocios">
          <BusinessDataTable />
        </ComponentCard>
      </div>
    </>
  );
}
