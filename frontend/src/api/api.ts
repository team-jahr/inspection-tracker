import { setFormId, setShowInspectionForm } from '../store/slices/AppSlice.ts';
import toast from 'react-hot-toast';
import { Dispatch } from 'react';
import { UnknownAction } from '@reduxjs/toolkit';
import {
  setAllAreas,
  setAllLocations,
  setDefaultLocation,
  setOtherLocations,
} from '../store/slices/InspectionFormSlice.ts';
import { Area, Inputs, Issue, IssueDTO, Location } from '../types/types.ts';

export const createNewInspectionForm = (dispatch: Dispatch<UnknownAction>) => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inspections/new-inspection`, {
    method: 'POST',
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else if (res.status > 400) {
        return new Error('We have a problem');
      }
    })
    .then((res) => {
      dispatch(setFormId(res.id));
      dispatch(setDefaultLocation(res.location));
      dispatch(setShowInspectionForm(true));
    })
    .catch((err) => {
      toast.error(err.message);
    });
};

export const fetchAllLocations = (
  dispatch: Dispatch<UnknownAction>,
  defaultLocation: Location,
) => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/locations`)
    .then((res) => res.json())
    .then((res) => {
      dispatch(setAllLocations(res));
      return res;
    })
    .then((res) => {
      const otherLocations = res.filter(
        (el: Location) => el.name !== defaultLocation.name,
      );
      dispatch(setOtherLocations(otherLocations));
    })
    .catch((err) => console.log(err));
};
export const fetchAllAreas = (
  dispatch: Dispatch<UnknownAction>,
  location: number,
) => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/areas?location=${location}`)
    .then((res) => res.json())
    .then((res) => {
      dispatch(setAllAreas(res));
    });
};

export const submitInspectionForm = (
  data: Inputs,
  locations: Location[],
  areas: Area[],
  formId: number,
  isSubmitted: boolean,
) => {
  const responseLocation = locations.filter(
    (el: Location) => el.id === +data.location,
  )[0];

  const responseArea = areas.filter((el: Area) => el.id == +data.area)[0];
  const createEmailString = () => {
    let emailList = '';
    for (let i = 0; i < data.emails.length; i++) {
      emailList += `${data.emails[i].value},`;
    }
    return emailList.substring(0, emailList.length - 1);
  };
  const responseEmail = data.email ? createEmailString() : null;

  const responseBody = {
    id: formId,
    isSubmitted: isSubmitted,
    date: new Date(data.date).toISOString(),
    location: responseLocation,
    area: responseArea,
    email: responseEmail,
    description: data.description,
  };

  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/inspections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody),
  }).catch((err) => console.log(err));
};

export const formatImages = (imgData: string): string => {
  return imgData.split(',')[1];
};

export const deleteIssueFromApi = (id: number) => {
  fetch(`${import.meta.env.VITE_API_BASE_URL}/api/issues/${id}`, {
    method: 'DELETE',
  }).catch(() => console.log('Error when deleting'));
};

export const fetchInspectionIssues = async (id: number): Promise<Issue[]> => {
  try {
    const inspectionIssuesResponse: Response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/inspections/${id}/issues`,
    );
    const inspectionIssuesData: IssueDTO =
      await inspectionIssuesResponse.json();
    const inspectionIssues: Issue[] = inspectionIssuesData.issues;
    const inspectionIssuesIds: number[] = inspectionIssues.map((el) => el.id);

    const issuesResponse: Response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/issues`,
    );
    const issuesData: IssueDTO = await issuesResponse.json();
    const issues: Issue[] = issuesData.issues;

    const relevantIssues: Issue[] = issues.filter((issue) =>
      inspectionIssuesIds.includes(issue.id),
    );

    relevantIssues.map((el) => {
      if (el.images.length === 1 && el.images[0] === '') {
        el.images = [];
      }
    });

    return new Promise<Issue[]>((resolve) => resolve(relevantIssues));
  } catch (err) {
    return new Promise<Issue[]>((_resolve, reject) =>
      reject(Error('Error while fetching inspection')),
    );
  }
};
