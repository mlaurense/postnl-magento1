<?php
/**
 *                  ___________       __            __
 *                  \__    ___/____ _/  |_ _____   |  |
 *                    |    |  /  _ \\   __\\__  \  |  |
 *                    |    | |  |_| ||  |   / __ \_|  |__
 *                    |____|  \____/ |__|  (____  /|____/
 *                                              \/
 *          ___          __                                   __
 *         |   |  ____ _/  |_   ____ _______   ____    ____ _/  |_
 *         |   | /    \\   __\_/ __ \\_  __ \ /    \ _/ __ \\   __\
 *         |   ||   |  \|  |  \  ___/ |  | \/|   |  \\  ___/ |  |
 *         |___||___|  /|__|   \_____>|__|   |___|  / \_____>|__|
 *                  \/                           \/
 *                  ________
 *                 /  _____/_______   ____   __ __ ______
 *                /   \  ___\_  __ \ /  _ \ |  |  \\____ \
 *                \    \_\  \|  | \/|  |_| ||  |  /|  |_| |
 *                 \______  /|__|    \____/ |____/ |   __/
 *                        \/                       |__|
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Creative Commons License.
 * It is available through the world-wide-web at this URL:
 * http://creativecommons.org/licenses/by-nc-nd/3.0/nl/deed.en_US
 * If you are unable to obtain it through the world-wide-web, please send an email
 * to servicedesk@totalinternetgroup.nl so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade this module to newer
 * versions in the future. If you wish to customize this module for your
 * needs please contact servicedesk@totalinternetgroup.nl for more information.
 *
 * @copyright   Copyright (c) 2014 Total Internet Group B.V. (http://www.totalinternetgroup.nl)
 * @license     http://creativecommons.org/licenses/by-nc-nd/3.0/nl/deed.en_US
 */
class TIG_PostNL_Block_Adminhtml_Widget_Grid_Column_Renderer_OrderConfirmDate
    extends Mage_Adminhtml_Block_Widget_Grid_Column_Renderer_Date
{
    /**
     * Additional column name used
     */
    const SHIPPING_METHOD_COLUMN = 'shipping_method';

    /**
     * Renders column.
     *
     * @param Varien_Object $row
     *
     * @return string
     */
    public function render(Varien_Object $row)
    {
        $postnlShippingMethods = Mage::helper('postnl/carrier')->getPostnlShippingMethods();
        $shippingMethod = $row->getData(self::SHIPPING_METHOD_COLUMN);
        if (!in_array($shippingMethod, $postnlShippingMethods)) {
            return parent::render($row);
        }

        $value = $row->getData($this->getColumn()->getIndex());

        /**
         * If we have no value, then no delivery date was chosen by the customer. In this case we can calculate when the
         * order could be shipped.
         */
        if (!$value) {
            $deliveryDate = Mage::helper('postnl/deliveryOptions')->getShippingDate(
                $row->getCreatedAt(),
                $row->getStoreId()
            );
            $value = date('Y-m-d H:i:s', strtotime('-1 day', strtotime($deliveryDate)));
        }

        $now = date('Ymd', Mage::getModel('core/date')->gmtTimestamp());

        /**
         * Check if the shipment should be confirmed today
         */
        if ($now == date('Ymd', strtotime($value))) {
            return Mage::helper('postnl')->__('Today');
        }

        /**
         * Check if the shipment should be confirmed somewhere in the future
         */
        if ($now < date('Ymd', strtotime($value))) {
            $confirmDate = new DateTime($value);
            $today = new DateTime($now);

            /**
             * Get the number of days until the shipment should be confirmed
             */
            $diff = $today->diff($confirmDate)->format('%a');

            /**
             * Check if it should be confirmed tomorrow
             */
            if ($diff == 1) {
                $renderedValue = Mage::helper('postnl')->__('Tomorrow');

                return $renderedValue;
            }

            /**
             * Render the number of days before the shipment should be confirmed
             */
            $renderedValue = Mage::helper('postnl')->__('%s days from now', $diff);

            return $renderedValue;
        }

        /**
         * Finally, simply render the date
         */
        $format = $this->_getFormat();
        try {
            if($this->getColumn()->getGmtoffset()) {
                $data = Mage::app()->getLocale()
                            ->date($value, Varien_Date::DATETIME_INTERNAL_FORMAT)->toString($format);
            } else {
                $data = Mage::getSingleton('core/locale')
                            ->date($value, Zend_Date::ISO_8601, null, false)->toString($format);
            }
        } catch (Exception $e) {
            if($this->getColumn()->getTimezone()) {
                $data = Mage::app()->getLocale()
                            ->date($value, Varien_Date::DATETIME_INTERNAL_FORMAT)->toString($format);
            } else {
                $data = Mage::getSingleton('core/locale')->date($value, null, null, false)->toString($format);
            }
        }
        return $data;
    }
}
