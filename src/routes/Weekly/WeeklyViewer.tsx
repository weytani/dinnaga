// ABOUTME: Weekly report viewer route (/weekly/:date) — DocFrame chrome over the static
// ABOUTME: week-in-review report; unknown dates render NotFound.
import { useParams } from 'react-router-dom';
import { DocFrame } from '../../components/DocFrame';
import { weeklyRunByDate } from '../../data/weeklyRuns';
import { NotFound } from '../NotFound/NotFound';

export function WeeklyViewer() {
  const { date } = useParams();
  const run = date ? weeklyRunByDate(date) : undefined;
  if (!run) return <NotFound />;
  return (
    <DocFrame
      eyebrow="// WEEK IN REVIEW"
      title={run.windowLabel}
      meta={`run ${run.date}`}
      docPath={run.docPath}
      screenLabel="Weekly"
    />
  );
}
