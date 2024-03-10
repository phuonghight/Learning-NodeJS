const { constants } = require("../constant");
const prisma = require("../prisma-client");
const { destroyByPath } = require("../utils/destroyFile");

const getAllByUserId = async (userId, { keyword, page, limit, sortBy }) => {
  page = parseInt(page) || constants.pageDefault;
  limit = parseInt(limit) || constants.limitDefault;
  sortBy ??= constants.sortByDefault;
  const where = { userId };
  if (keyword) {
    where["OR"] = [
      { note: { search: keyword } },
      { location: { search: keyword } },
      { withPerson: { search: keyword } },
    ];
  }
  const [transactions, total] = await prisma.$transaction([
    prisma.transaction.findMany({
      where: where,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        [sortBy]: "desc",
      },
    }),
    prisma.transaction.count(),
  ]);
  return { transactions, keyword, page, limit, total, sortBy };
};

const getById = async (id) => {
  const transaction = await prisma.transaction.findUnique({ where: { id } });
  return transaction;
};

const create = async (userId, data) => {
  const total = parseFloat(data.total);
  const transaction = await prisma.transaction.create({
    data: {
      ...data,
      userId,
      total,
      date: new Date(data.date),
    },
  });
  return transaction;
};

const updateById = async (id, data) => {
  let { total, date } = data;
  if (total) total = parseFloat(total);
  if (date) date = new Date(date);
  const transaction = await prisma.transaction.update({
    where: { id },
    data: { ...data, total, date },
  });
  return transaction;
};

const deleteById = async (id) => {
  const transaction = await prisma.transaction.delete({ where: { id } });
  transaction.imgUrl && (await destroyByPath(transaction.imgUrl));
  return transaction;
};

module.exports = { getAllByUserId, getById, create, updateById, deleteById };
