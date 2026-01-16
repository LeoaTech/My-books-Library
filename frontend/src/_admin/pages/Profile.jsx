import StripeConnect from '../../components/_admin/Account/StripeConnect/StripeConnect';
import ProfileUpdateForm from '../../components/_admin/Account/ProfileUpdateForm';
import { useAuthContext } from '../../hooks/useAuthContext';

const Profile = () => {

  const { auth } = useAuthContext();
  const entityId = auth?.entityId;
  if (!auth?.entityId) {
    return (
      <p> No Library ID found</p>
    )
  }



  if (entityId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <section className="mb-8">
          <StripeConnect
            entityId={entityId}
          />
        </section>

        <section>
          <ProfileUpdateForm />
        </section>


      </div>
    );
  }
}

export default Profile

