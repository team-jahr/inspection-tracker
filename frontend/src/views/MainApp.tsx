import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store.ts';
import { Toaster } from 'react-hot-toast';
import { Drawer } from 'antd';
import InspectionForm from '../components/InspectionForm.tsx';
import IssueForm from '../components/IssueForm.tsx';
import { setShowDrawer } from '../store/slices/IssueFormSlice.ts';
import { setEditIssue } from '../store/slices/InspectionFormSlice.ts';
import './MainApp.css';

const MainApp = () => {
  const isDrawerVisible = useSelector(
    (state: RootState) => state.issueForm.isDrawerOpen,
  );
  const formId = useSelector((state: RootState) => state.app.formId);
  const dispatch = useDispatch();

  const onCloseDrawer = () => {
    dispatch(setShowDrawer(false));
    dispatch(setEditIssue(null));
  };

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <h1 className='main-title'> Inspection nr {formId}</h1>
      <InspectionForm />
      <Drawer
        title='Add Issue'
        placement='right'
        closable={true}
        onClose={onCloseDrawer}
        open={isDrawerVisible}
        width={500}
      >
        <IssueForm />
      </Drawer>
    </>
  );
};

export default MainApp;