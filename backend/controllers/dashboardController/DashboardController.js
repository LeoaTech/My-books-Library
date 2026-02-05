const db = require("../../config/dbConfig");

const getDashboardMetrics = async (req, res) => {
  const user = req.user;

  const entityId = user?.entityId || user?.entity_id;
  const userId = user?.userId || user?.user_id;
  // console.log(req.user, "Req User");

  try {
    const popularBooks = await totalBooks(db, entityId);
    const bookingSummary = await totalBookings(db, entityId);
    const recentlyAddedBooks = await recentlyAddedBook(db, entityId);
    const booksByAuthorsSummary = await booksAuthors(db, entityId);
    const totalUserCount = await totalUsers(db, entityId, userId);
    const overdueBooksCount = await totalOverdueBooks(db, entityId);

    const BooksCategorySummary = await booksCategories(db, entityId);
    const bookingsByCategory = await bookingsByCategories(db, entityId);
    const bookingsByLocation = await bookingsByCity(db, entityId);
    const monthlyBookingSummary = await bookingsByMonth(db, entityId);

    res.status(200).json({
      popularBooks: popularBooks.books,
      bookingSummary: bookingSummary?.bookings,
      recentlyAddedBooks: recentlyAddedBooks.recentBooks,
      booksByAuthorsSummary: booksByAuthorsSummary?.booksAuthors,
      totalUsers: totalUserCount?.users?.count || 0,
      totalOverdueBooks: overdueBooksCount?.overdueBooks?.count || 0,
      booksCategorySummary: BooksCategorySummary?.bookCategories,
      bookingsByCategory: bookingsByCategory?.data || [],
      bookingsByLocation: bookingsByLocation?.data || [],
      monthlyBookingSummary: monthlyBookingSummary?.data || [],
    });
  } catch (error) {
    res.status(500).json({ message: "Error getting dashboard metrics" });
  }
};

async function totalBooks(db, entityId) {
  const getEntityBranches = `Select id from branches where entity_id = $1`;
  try {
    const getBranchIds = await db.query(getEntityBranches, [entityId]);

    if (getBranchIds.rowCount == 0) {
      return { books: [] };
    }

    let branchIds = getBranchIds.rows.map((branch) => branch.id);
    const getBooksList = await db.query(
      `SELECT COUNT(*) FROM books
          WHERE branch_id = ANY ($1)`,
      [branchIds],
    );
    return { books: getBooksList?.rows[0] };
  } catch (error) {
    return { error: error, books: [] };
  }
}

async function totalBookings(db, entityId) {
  try {
    const getBookingsList = await db.query(
      `SELECT COUNT(*) FROM bookings
          WHERE entity_id = $1`,
      [entityId],
    );
    return { bookings: getBookingsList?.rows[0] };
  } catch (error) {
    return { error: error, bookings: [] };
  }
}

async function totalUsers(db, entityId, userId) {
  try {
    const getUsersCount = await db.query(
      `SELECT COUNT(*) FROM user_entity_roles 
          WHERE entity_id = $1 AND user_id != $2`,
      [entityId, userId],
    );
    return { users: getUsersCount?.rows[0] };
  } catch (error) {
    return { error: error, users: [] };
  }
}

async function totalOverdueBooks(db, entityId) {
  try {
    const getOverdueBooksCount = await db.query(
      `SELECT COUNT(*) FROM bookings
          WHERE entity_id = $1 AND return_date IS NULL AND return_due < CURRENT_TIMESTAMP`,
      [entityId],
    );
    return { overdueBooks: getOverdueBooksCount?.rows[0] };
  } catch (error) {
    return { error: error, overdueBooks: [] };
  }
}

// Get Recently Added Books
async function recentlyAddedBook(db, entityId) {
  const getEntityBranches = `Select id from branches where entity_id = $1`;
  try {
    const getBranchIds = await db.query(getEntityBranches, [entityId]);

    if (getBranchIds.rowCount == 0) {
      return { recentBooks: [] };
    }

    let branchIds = getBranchIds.rows.map((branch) => branch.id);

    const recentBooks = await db.query(
      `SELECT 
  b.id,
  b.title,
  a.name AS author,
  b.created_at
FROM 
  public.books AS b
JOIN 
  public.authors a ON b.author = a.id
JOIN
  public.branches AS br ON b.branch_id = br.id
WHERE
  b.branch_id = ANY ($1::int[])
ORDER BY 
  b.created_at DESC
LIMIT 10`,
      [branchIds],
    );

    return { recentBooks: recentBooks?.rows };
  } catch (error) {
    return { error: error, recentBooks: [] };
  }
}

// Get Books Count by Authors

async function booksAuthors(db, entityId) {
  const getEntityBranches = `Select id from branches where entity_id = $1`;
  try {
    const getBranchIds = await db.query(getEntityBranches, [entityId]);

    if (getBranchIds.rowCount == 0) {
      return { booksAuthors: [] };
    }

    let branchIds = getBranchIds.rows.map((branch) => branch.id);

    const booksAuthorsCount = await db.query(
      `SELECT
    a.name AS name,
    br.name AS branch_name,
    COUNT(b.id) AS totalBooks
FROM
    public.books AS b
JOIN
    public.authors AS a ON b.author = a.id
JOIN
    public.branches AS br ON b.branch_id = br.id
WHERE
    b.branch_id = ANY ($1)
GROUP BY
    a.name, br.name
ORDER BY
    totalBooks DESC
LIMIT 12`,
      [branchIds],
    );

    return {
      booksAuthors: booksAuthorsCount?.rows || [],
    };
  } catch (error) {
    // console.log(error, "Error getting books count for Authors");
    return { error, booksAuthors: [] };
  }
}

// Get Books count with Categories

async function booksCategories(db, entityId) {
  const getEntityBranches = `Select id from branches where entity_id = $1`;
  try {
    const getBranchIds = await db.query(getEntityBranches, [entityId]);
    // console.log(getBranchIds.rows, "Branches");

    if (getBranchIds.rowCount == 0) {
      return { booksCategories: [] };
    }

    let branchIds = getBranchIds.rows.map((branch) => branch.id);

    const getBooksList = await db.query(
      `SELECT
    c.name AS name,
    br.name AS branch_name,
    COUNT(b.id)::int AS count
FROM
    public.books AS b
JOIN
    public.categories AS c ON b.category = c.id
JOIN
    public.branches AS br ON b.branch_id = br.id
WHERE
    b.branch_id = ANY ($1)
GROUP BY
    c.name, br.name
ORDER BY
    count DESC
LIMIT 10`,
      [branchIds],
    );

    return {
      bookCategories: getBooksList?.rows || [],
    };
  } catch (error) {
    // console.log(error, "Error getting books");
    return { error, bookCategories: [] };
  }
}

// Get Bookings Count by Categories
async function bookingsByCategories(db, entityId) {
  try {
    const result = await db.query(
      `SELECT 
        item->>'category_name' AS name,
        COUNT(DISTINCT b.id)::int AS bookings
      FROM bookings b
      JOIN LATERAL jsonb_array_elements(b.items) AS item ON true
      WHERE b.entity_id = $1
      GROUP BY item->>'category_name'
      ORDER BY bookings DESC
      LIMIT 10`,
      [entityId],
    );

    return { data: result?.rows || [] };
  } catch (error) {
    // console.log(error, "Error getting bookings by categories");
    return { error, data: [] };
  }
}

// Get Bookings Count by Location (City)
async function bookingsByCity(db, entityId) {
  try {
    const result = await db.query(
      `SELECT 
        COALESCE(shipping_city, 'Unknown') AS name,
        COUNT(*)::int AS bookings
      FROM bookings
      WHERE entity_id = $1 AND shipping_city IS NOT NULL
      GROUP BY shipping_city
      ORDER BY bookings DESC
      LIMIT 10`,
      [entityId],
    );

    return { data: result?.rows || [] };
  } catch (error) {
    // console.log(error, "Error getting bookings by location");
    return { error, data: [] };
  }
}

// Get Bookings Count by Month (Last 4 Months)
async function bookingsByMonth(db, entityId) {
  try {
    const result = await db.query(
      `SELECT 
        TO_CHAR(DATE_TRUNC('month', borrow_date), 'Mon') AS name,
        COUNT(*)::integer AS bookings,
        EXTRACT(MONTH FROM borrow_date)::integer AS month_num
      FROM bookings
      WHERE entity_id = $1 
        AND borrow_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '3 months'
      GROUP BY DATE_TRUNC('month', borrow_date), EXTRACT(MONTH FROM borrow_date)
      ORDER BY DATE_TRUNC('month', borrow_date) ASC`,
      [entityId],
    );

    const colors = ["#3b82f6", "#22c55e", "#f97316", "#ef4444"];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    const allMonths = [];

    for (let i = 3; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      );
      const monthName = monthNames[date.getMonth()];

      const monthData = result?.rows.find((row) => row.name === monthName);

      allMonths.push({
        name: monthName,
        bookings: monthData ? monthData.bookings : 0,
        color: colors[(3 - i) % colors.length],
      });
    }

    return { data: allMonths };
  } catch (error) {
    // console.log(error, "Error getting monthly booking summary");
    return { error, data: [] };
  }
}

module.exports = {
  totalBooks,
  totalUsers,
  totalOverdueBooks,
  getDashboardMetrics,
};
