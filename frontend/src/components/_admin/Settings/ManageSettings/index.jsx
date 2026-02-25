import { lazy, Suspense, useState } from 'react'
import Loader from '../../Loader/Loader';

const AuthorManager = lazy(() => import('./ManageAuthors/AuthorManager'));
const CategoryManager = lazy(() => import('./ManageCategories/CategoryManager'));
const ConditionManager = lazy(() => import('./ManageConditions/ConditionManager'));
const CoverManager = lazy(() => import('./ManageCovers/CoverManager'));
const PublisherManager = lazy(() => import('./ManagePublishers/PublisherManager'));
const BranchManager = lazy(() => import('./ManageBranches/BranchManager'));

const tabs = [
    { id: 'Author', component: AuthorManager },
    { id: 'Category', component: CategoryManager },
    { id: 'Condition', component: ConditionManager },
    { id: 'Cover', component: CoverManager },
    { id: 'Publisher', component: PublisherManager },
    { id: 'Branches', component: BranchManager },
];

const ManageSettings = () => {

    const [selectedTab, setSelectedTab] = useState('Author');
    // Get the selected tab component
    const SelectedComponent = tabs.find(tab => tab.id === selectedTab)?.component;
    return (
        <div className="flex bg-background border-border">
            <div className="w-1/5 bg-surface border-r border-border">
                <ul className="flex flex-col justify-center items-center p-4 gap-4">
                    {tabs.map(tab => (
                        <li key={tab.id}>
                            <button
                                onClick={() => setSelectedTab(tab.id)}
                                className={`w-full sm:w-[100px] bg-background text-primary active:bg-primary 
            font-medium rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 px-2 py-2 md:px-3  ${selectedTab === tab.id ? 'bg-primary text-surface' : 'hover:bg-secondary'
                                    }`}
                            >
                                {tab.id}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Render component based on the tab selected */}
            <div className="w-4/5 p-6">
                <Suspense fallback={<Loader />}>
                    {SelectedComponent && <SelectedComponent />}
                </Suspense>
            </div>
        </div>
    );
}

export default ManageSettings